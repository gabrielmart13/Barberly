using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barberly.API.Models
{
    public class Barbeiro
    {
        [Key]
        public int IdBarbeiro { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Contato { get; set; }
        public string? Experiencia { get; set; }

        public int IdBarbearia { get; set; }

        [ForeignKey(nameof(IdBarbearia))]
        public Barbearia? Barbearia { get; set; }
    }
}
