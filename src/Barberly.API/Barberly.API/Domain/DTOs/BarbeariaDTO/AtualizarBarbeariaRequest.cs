namespace Barberly.API.Domain.DTOs.BarbeariaDTO
{
    public class AtualizarBarbeariaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string Contato { get; set; } = string.Empty;
        public string? Descricao { get; set; } 
        public int IdDonoBarbearia { get; set; }
    }
}
