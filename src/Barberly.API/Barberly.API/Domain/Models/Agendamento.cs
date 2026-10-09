using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barberly.API.Domain.Models
{
    public class Agendamento
    {
        [Key]
        public int IdAgendamento { get; set; }
        public DateTime DataHora { get; set; }
        public string Status { get; set; }
        public int IdUsuario { get; set; }

        [ForeignKey(nameof(IdUsuario))]
        public Usuario? Usuario { get; set; }
        public int IdServico { get; set; }

        [ForeignKey(nameof(IdServico))]
        public Servico? Servico { get; set; }
        public int IdBarbeiro { get; set; }

        [ForeignKey(nameof(IdBarbeiro))]
        public Barbeiro? Barbeiro { get; set; }
        public int IdBarbearia { get; set; }

        [ForeignKey(nameof(IdBarbearia))]
        public Barbearia? Barbearia { get; set; }

    }
}
