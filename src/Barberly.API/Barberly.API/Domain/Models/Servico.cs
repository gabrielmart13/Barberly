using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Barberly.API.Domain.Models
{
    public class Servico
    {
        [Key]
        public int IdServico { get; set; }
        public string Nome { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public int TempoEstimado { get; set; }
        public int IdCategoria { get; set; }

        [ForeignKey(nameof(IdCategoria))]
        public CategoriaServico? Categoria { get; set; }
        public int IdBarbearia { get; set; }

        [ForeignKey(nameof(IdBarbearia))]
        public Barbearia? Barbearia { get; set; }

    }
}
