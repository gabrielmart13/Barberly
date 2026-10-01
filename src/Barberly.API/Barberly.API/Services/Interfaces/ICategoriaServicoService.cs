using Barberly.API.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface ICategoriaServicoService
    {
        public Task<List<CategoriaServico>> PegarTodasCategoriasAsync();
        public Task<CategoriaServico> PegarCategoriaAsync(int id);
        public Task<CategoriaServico> CriarCategoriaAsync(CategoriaServico categoria);
        public Task<CategoriaServico> AtualizarCategoriaAsync(int id, CategoriaServico categoria);
        public Task<CategoriaServico> DeletarCategoriaAsync(int id);
    }
}
