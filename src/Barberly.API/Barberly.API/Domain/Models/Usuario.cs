using System.ComponentModel.DataAnnotations;

namespace Barberly.API.Domain.Models
{
    public class Usuario
    {
        [Key]
        public int IdUsuario { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; }= string.Empty;
        public string Contato { get; set; }= string.Empty;
    }
}
