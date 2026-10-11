namespace Barberly.API.Domain.DTOs.BarbeiroDTO
{
    public class AtualizarBarbeiroRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Contato { get; set; } = string.Empty;
        public string? Experiencia { get; set; }
        public int IdBarbearia { get; set; }
    }
}
