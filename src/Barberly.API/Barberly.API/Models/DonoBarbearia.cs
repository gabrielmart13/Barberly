using System.ComponentModel.DataAnnotations;

namespace Barberly.API.Models
{
    public class DonoBarbearia
    {
        [Key]
        public int IdDonoBarbearia { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Senha { get; set; }
        public string Contato { get; set; }
    }
}
