using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barberly.API.Domain.Models
{
    public class Barbeiro
    {
        [Key]
        public int IdBarbeiro { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Contato { get; set; } = string.Empty;
        public string? Experiencia { get; set; }

        public int IdBarbearia { get; set; }

        [ForeignKey(nameof(IdBarbearia))]
        public Barbearia? Barbearia { get; set; }
    }
}
