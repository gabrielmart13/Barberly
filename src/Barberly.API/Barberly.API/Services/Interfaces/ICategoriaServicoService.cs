using Barberly.API.Domain.DTOs.CategoriaServicoDTO;
using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface ICategoriaServicoService
    {
        public Task<List<CategoriaServico>> PegarTodasCategoriasAsync();
        public Task<CategoriaServico> PegarCategoriaAsync(int id);
        public Task<CategoriaServico> CriarCategoriaAsync(CriarCategoriaRequest categoria);
        public Task<CategoriaServico> AtualizarCategoriaAsync(int id, AtualizarCategoriaRequest request);
        public Task<CategoriaServico> DeletarCategoriaAsync(int id);
    }
}
