using System.ComponentModel.DataAnnotations;

namespace Barberly.API.Domain.Models
{
    public class CategoriaServico
    {
        [Key]
        public int IdCategoria { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string? Descricao { get; set; }
    }
}
