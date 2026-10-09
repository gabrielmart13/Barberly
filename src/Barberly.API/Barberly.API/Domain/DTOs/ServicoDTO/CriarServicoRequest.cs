namespace Barberly.API.Domain.DTOs.ServicoDTO
{
    public class CriarServicoRequest
    {
        public string Nome { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public int TempoEstimado { get; set; }
        public int IdCategoria { get; set; }
        public int IdBarbearia { get; set; }
    }
}
