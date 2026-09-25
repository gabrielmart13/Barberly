using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barberly.API.Models
{
    public class Avaliacao
    {
        [Key]
        public int IdAvaliacao { get; set; }
        public int Nota { get; set; }
        public string? Comentario { get; set; }
        public DateTime DataAvaliacao { get; set; }

        public int IdUsuario { get; set; }

        [ForeignKey(nameof(IdUsuario))]
        public Usuario? Usuario { get; set; }

        public int IdAgendamento { get; set; }

        [ForeignKey(nameof(IdAgendamento))]
        public Agendamento? Agendamento { get; set; }
    }
}
