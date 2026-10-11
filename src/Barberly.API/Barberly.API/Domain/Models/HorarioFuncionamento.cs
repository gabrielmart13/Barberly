using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barberly.API.Domain.Models
{
    public class HorarioFuncionamento
    {
        [Key]
        public int IdHorario { get; set; }
        public string DiaSemana { get; set; } = string.Empty;
        public TimeSpan HoraAbertura { get; set; } 
        public TimeSpan HoraFechamento { get; set; }

        public int IdBarbearia { get; set; }

        [ForeignKey(nameof(IdBarbearia))]
        public Barbearia? Barbearia { get; set; }
    }
}
