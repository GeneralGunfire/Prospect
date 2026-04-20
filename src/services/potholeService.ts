import { supabase } from '../lib/supabase';

export type PotholeSeverity = 'low' | 'medium' | 'high';
export type PotholeStatus = 'needs_attention' | 'reported' | 'fixed';

export interface Pothole {
  id: string;
  user_id: string | null;
  latitude: number;
  longitude: number;
  address: string;
  street_name: string | null;
  province: string;
  municipality: string | null;
  description: string | null;
  image_url: string | null;
  severity: PotholeSeverity;
  flag_count: number;
  status: PotholeStatus;
  needs_fixing: boolean;
  created_at: string;
  fixed_at: string | null;
  fixed_by_user_id: string | null;
}

export interface CreatePotholeData {
  userId: string;
  latitude: number;
  longitude: number;
  address: string;
  streetName?: string;
  province: string;
  municipality?: string;
  description?: string;
  imageUrl?: string;
  severity: PotholeSeverity;
}

export interface PotholeFilters {
  province?: string;
  streetName?: string;
  needsFixingOnly?: boolean;
}

export async function createPothole(data: CreatePotholeData): Promise<{ id: string; success: boolean; error?: string }> {
  try {
    const { data: row, error } = await supabase
      .from('potholes')
      .insert({
        user_id: data.userId,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address,
        street_name: data.streetName ?? null,
        province: data.province,
        municipality: data.municipality ?? null,
        description: data.description ?? null,
        image_url: data.imageUrl ?? null,
        severity: data.severity,
        flag_count: 1,
        status: 'needs_attention',
        needs_fixing: false,
      })
      .select('id')
      .single();

    if (error) return { id: '', success: false, error: error.message };
    return { id: row.id, success: true };
  } catch (e) {
    return { id: '', success: false, error: String(e) };
  }
}

export async function flagPothole(potholeId: string, userId: string): Promise<{
  success: boolean;
  flagCount: number;
  needsFixing: boolean;
  error?: string;
}> {
  try {
    // Insert flag (unique constraint prevents duplicates)
    const { error: flagError } = await supabase
      .from('pothole_flags')
      .insert({ pothole_id: potholeId, user_id: userId });

    if (flagError) {
      if (flagError.code === '23505') {
        return { success: false, flagCount: 0, needsFixing: false, error: 'already_flagged' };
      }
      return { success: false, flagCount: 0, needsFixing: false, error: flagError.message };
    }

    // Get updated flag count
    const { data: pothole, error: fetchError } = await supabase
      .from('potholes')
      .select('flag_count')
      .eq('id', potholeId)
      .single();

    if (fetchError) return { success: false, flagCount: 0, needsFixing: false, error: fetchError.message };

    const newCount = (pothole.flag_count ?? 0) + 1;
    const needsFixing = newCount >= 3;

    await supabase
      .from('potholes')
      .update({
        flag_count: newCount,
        needs_fixing: needsFixing,
        status: needsFixing ? 'reported' : 'needs_attention',
      })
      .eq('id', potholeId);

    return { success: true, flagCount: newCount, needsFixing };
  } catch (e) {
    return { success: false, flagCount: 0, needsFixing: false, error: String(e) };
  }
}

export async function getPothole(id: string): Promise<Pothole | null> {
  const { data, error } = await supabase
    .from('potholes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Pothole;
}

export async function getAllPotholes(filters?: PotholeFilters): Promise<Pothole[]> {
  try {
    let query = supabase
      .from('potholes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);

    if (filters?.province) query = query.eq('province', filters.province);
    if (filters?.needsFixingOnly) query = query.eq('needs_fixing', true);
    if (filters?.streetName) query = query.ilike('street_name', `%${filters.streetName}%`);

    const { data, error } = await query;
    if (error) throw error;
    return (data as Pothole[]) ?? [];
  } catch {
    return [];
  }
}

export async function getUserReportedPotholes(userId: string): Promise<Pothole[]> {
  try {
    const { data, error } = await supabase
      .from('potholes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Pothole[]) ?? [];
  } catch {
    return [];
  }
}

export async function getUserFlaggedPotholes(userId: string): Promise<Pothole[]> {
  try {
    const { data: flags, error: flagError } = await supabase
      .from('pothole_flags')
      .select('pothole_id')
      .eq('user_id', userId);

    if (flagError || !flags?.length) return [];

    const ids = flags.map((f: { pothole_id: string }) => f.pothole_id);
    const { data, error } = await supabase
      .from('potholes')
      .select('*')
      .in('id', ids)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as Pothole[]) ?? [];
  } catch {
    return [];
  }
}

export async function markPotholeAsFixed(
  potholeId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('potholes')
      .update({
        status: 'fixed',
        fixed_at: new Date().toISOString(),
        fixed_by_user_id: userId,
      })
      .eq('id', potholeId);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e) {
    return { success: false, error: String(e) };
  }
}

export async function hasUserFlaggedPothole(potholeId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('pothole_flags')
    .select('id')
    .eq('pothole_id', potholeId)
    .eq('user_id', userId)
    .maybeSingle();

  return !!data;
}

export async function uploadPotholeImage(
  file: File,
  userId: string,
  potholeId: string
): Promise<{ url: string | null; error?: string }> {
  try {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `${userId}/${potholeId}/${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from('potholes')
      .upload(path, file, { contentType: file.type, upsert: false });

    if (error) return { url: null, error: error.message };

    const { data } = supabase.storage.from('potholes').getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (e) {
    return { url: null, error: String(e) };
  }
}
