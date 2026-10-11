namespace Barberly.API.Domain.DTOs.AgendamentoDTO
{
    public class CriarAgendamentoRequest
    {
        public DateTime DataHora { get; set; }
        public string Status { get; set; } = string.Empty;
        public int IdUsuario { get; set; }
        public int IdServico { get; set; }
        public int IdBarbeiro { get; set; }
        public int IdBarbearia { get; set; }
    }
}
