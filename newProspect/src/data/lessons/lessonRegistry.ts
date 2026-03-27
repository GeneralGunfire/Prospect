import { LessonData } from '../../types/lesson'

// Import all lessons
import * as Mathematics from './grade10/term1/mathematics'
import * as PhysicalSciences from './grade10/term1/physical-sciences'
import * as Chemistry from './grade10/term1/chemistry'
import * as EGD from './grade10/term1/egd'
import * as Accounting from './grade10/term1/accounting'
import * as English from './grade10/term1/english'
import * as Afrikaans from './grade10/term1/afrikaans'
import * as LifeSciences from './grade10/term1/life-sciences'
import * as Economics from './grade10/term1/economics'
import * as CAT from './grade10/term1/cat'

interface LessonRegistryKey {
  subjectId: string
  grade: number
  term: number
  topicId: string
}

type RegistryMap = Record<string, LessonData>

const registry: RegistryMap = {
  // Mathematics
  'maths-10-1-laws-of-exponents': Mathematics.LawsOfExponents,
  'maths-10-1-expanding-brackets': Mathematics.ExpandingBrackets,
  'maths-10-1-factorisation': Mathematics.Factorisation,
  'maths-10-1-algebraic-fractions': Mathematics.AlgebraicFractions,
  'maths-10-1-linear-equations': Mathematics.LinearEquations,
  'maths-10-1-quadratic-equations': Mathematics.QuadraticEquations,
  'maths-10-1-linear-inequalities': Mathematics.LinearInequalities,
  'maths-10-1-arithmetic-sequences': Mathematics.ArithmeticSequences,
  'maths-10-1-functions': Mathematics.Functions,
  'maths-10-1-mathematical-modelling': Mathematics.MathematicalModelling,

  // Physical Sciences - Physics
  'phys-sci-10-1-transverse-waves': PhysicalSciences.TransverseWaves,
  'phys-sci-10-1-wave-properties': PhysicalSciences.WaveProperties,
  'phys-sci-10-1-wave-behaviour': PhysicalSciences.WaveBehaviour,
  'phys-sci-10-1-longitudinal-waves': PhysicalSciences.LongitudinalWaves,
  'phys-sci-10-1-electromagnetic-radiation': PhysicalSciences.ElectromagneticRadiation,

  // Chemistry
  'phys-sci-10-1-classification-of-matter': Chemistry.ClassificationOfMatter,
  'phys-sci-10-1-physical-vs-chemical-change': Chemistry.PhysicalVsChemicalChange,
  'phys-sci-10-1-atomic-structure': Chemistry.AtomicStructure,
  'phys-sci-10-1-electron-configuration': Chemistry.ElectronConfiguration,
  'phys-sci-10-1-periodic-table-trends': Chemistry.PeriodicTableTrends,

  // EGD
  'egd-10-1-drawing-instruments': EGD.DrawingInstruments,
  'egd-10-1-geometrical-constructions': EGD.GeometricalConstructions,
  'egd-10-1-freehand-drawing': EGD.FreehandDrawing,
  'egd-10-1-orthographic-projection': EGD.OrthographicProjection,
  'egd-10-1-isometric-drawing': EGD.IsometricDrawing,

  // Accounting
  'accounting-10-1-accounting-equation': Accounting.AccountingEquation,
  'accounting-10-1-double-entry-system': Accounting.DoubleEntrySystem,
  'accounting-10-1-source-documents': Accounting.SourceDocuments,
  'accounting-10-1-journals': Accounting.Journals,
  'accounting-10-1-general-ledger': Accounting.GeneralLedger,

  // English
  'english-hl-10-1-language-structures': English.LanguageStructures,
  'english-hl-10-1-sentence-types': English.SentenceTypes,
  'english-hl-10-1-punctuation-mechanics': English.PunctuationMechanics,
  'english-hl-10-1-comprehension-summary': English.ComprehensionSummary,
  'english-hl-10-1-visual-literacy': English.VisualLiteracy,

  // Afrikaans
  'afrikaans-hl-10-1-taalstrukture': Afrikaans.Taalstrukture,
  'afrikaans-hl-10-1-tense-system': Afrikaans.TenseSystem,
  'afrikaans-hl-10-1-begripstoets': Afrikaans.Begripstoets,
  'afrikaans-hl-10-1-skryfwerk': Afrikaans.Skryfwerk,
  'afrikaans-hl-10-1-letterkunde-woordeskat': Afrikaans.Letterkunde,

  // Life Sciences
  'life-sci-10-1-biodiversity-definition': LifeSciences.BiodiversityDefinition,
  'life-sci-10-1-levels-of-biodiversity': LifeSciences.LevelsOfBiodiversity,
  'life-sci-10-1-classification-five-kingdoms': LifeSciences.ClassificationFiveKingdoms,
  'life-sci-10-1-taxonomy-nomenclature': LifeSciences.TaxonomyNomenclature,
  'life-sci-10-1-species-concept': LifeSciences.SpeciesConcept,
  'life-sci-10-1-distribution': LifeSciences.Distribution,

  // Economics
  'economics-10-1-basic-economic-problem': Economics.BasicEconomicProblem,
  'economics-10-1-production-possibility-curve': Economics.ProductionPossibilityCurve,
  'economics-10-1-circular-flow-model': Economics.CircularFlowModel,
  'economics-10-1-factors-of-production': Economics.FactorsOfProduction,
  'economics-10-1-supply-demand-intro': Economics.SupplyDemandIntro,

  // CAT
  'cat-10-1-computer-systems': CAT.ComputerSystems,
  'cat-10-1-input-output-devices': CAT.InputOutputDevices,
  'cat-10-1-information-processing-cycle': CAT.InformationProcessingCycle,
  'cat-10-1-file-management': CAT.FileManagement,
  'cat-10-1-word-processing': CAT.WordProcessing,
}

export function getLessonData(
  subjectId: string,
  grade: number,
  term: number,
  topicId: string
): LessonData | null {
  const key = `${subjectId}-${grade}-${term}-${topicId}`
  return registry[key] || null
}

export function getSubjectTopics(subjectId: string, grade: number, term: number): LessonData[] {
  return Object.values(registry).filter(
    lesson =>
      lesson.subjectId === subjectId && lesson.grade === grade && lesson.term === term
  )
}

export function getAllLessons(): LessonData[] {
  return Object.values(registry)
}
