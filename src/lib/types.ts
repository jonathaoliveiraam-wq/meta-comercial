export interface Lancamento {
  id?: number
  qty: number
  val: number
  tipo: 'recebido' | 'sebrae'
  valorRec: number
  recTotal: number
  equiv: number
  desc: string
  data: string
  parceiro: string
}

export interface ClienteMensal {
  id?: number
  desc: string
  data: string
  parceiro: string
}

export interface ClienteAnual {
  id?: number
  desc: string
  data: string
  parceiro: string
}

export interface Parceiro {
  id: string
  nome: string
  user: string
  senha: string
  termoAceito: boolean
  termoData?: string
  termoVersao?: string
  termoIp?: string
  whats?: string
  email?: string
  nascimento?: string
  pix?: string
}

export interface CrmLead {
  id: string
  leadId: string | null
  nome: string
  whats: string
  segmento: string
  obs: string
  parceiro: string
  parceiroNome: string
  etapa: number
  plano: string
  valor: number
  data: string
  historico: EtapaHistorico[]
}

export interface EtapaHistorico {
  etapa: number
  data: string
  user: string
  plano?: string
}

export interface CrmRenovacao {
  id: string
  nome: string
  whats: string
  segmento: string
  obs: string
  plano: string
  valor: number
  tipoCustom: string
  etapa: number
  data: string
  historico: EtapaHistorico[]
}

export interface Renovacao {
  id?: number
  clienteId: string
  nome: string
  plano: string
  valor: number
  tipo: string
  data: string
  user: string
}

export interface Lead {
  id: string
  parceiroId: string
  parceiroNome: string
  nome: string
  whats: string
  segmento: string
  obs: string
  data: string
}
