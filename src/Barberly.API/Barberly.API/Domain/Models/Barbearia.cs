using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barberly.API.Domain.Models
{
    public class Barbearia
    {
        [Key]
        public int IdBarbearia { get; set; }
        public string Nome { get; set; }
        public string Endereco { get; set; }
        public string Contato { get; set; }
        public string? Descricao { get; set; }

        public int IdDonoBarbearia { get; set; }

        [ForeignKey(nameof(IdDonoBarbearia))]
        public DonoBarbearia? DonoBarbearia { get; set; }
    }
}
