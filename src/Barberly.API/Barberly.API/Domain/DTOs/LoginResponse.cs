
namespace Barberly.API.Domain.DTOs.AuthDTO
{
    public class LoginResponse
    {
        public string Token { get; set; } = string.Empty;
        public string TipoUsuario { get; set; } = string.Empty;
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime ExpiraEmUtc { get; set; }
    }
}

