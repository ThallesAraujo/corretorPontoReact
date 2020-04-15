export default class Ponto{
  public id: number = 0;
  public pessoa_id: number | null = 0;
  public data: Date = new Date();
  public entrada1: Date = new Date();
  public saida1: Date = new Date();
  public entrada2: Date = new Date();
  public saida2: Date = new Date();
  public entrada3: Date = new Date();
  public saida3: Date = new Date();
  public entrada4: Date = new Date();
  public saida4: Date = new Date();
  public is_ferias: Boolean = false;
  public is_falta: Boolean = false;
  public is_inconsistente: Boolean = false;
  public is_atestado: Boolean = false;
  public qtd_hora_total: Number = 0;
  public qtd_hora_saldo: Number = 0;
  
  public readonly created_at: Date = new Date();
  public readonly updated_at: Date = new Date();

}
