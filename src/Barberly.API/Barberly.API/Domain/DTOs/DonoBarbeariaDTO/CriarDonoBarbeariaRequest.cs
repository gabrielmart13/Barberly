namespace Barberly.API.Domain.DTOs.DonoBarbeariaDTO
{
    public class CriarDonoBarbeariaRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string Contato { get; set; } = string.Empty;
    }
}
