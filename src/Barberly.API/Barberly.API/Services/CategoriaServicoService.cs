using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class CategoriaServicoService : ICategoriaServicoService
    {
        private readonly IGeralRepo _geralRepo;
        public CategoriaServicoService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<CategoriaServico> AtualizarCategoriaAsync(int id, CategoriaServico categoria)
        {
            if (categoria == null)
            {
                throw new Exception("Categoria não encontrada.");
            }
            var categoriaAtt = await _geralRepo.PegarPorId<CategoriaServico>(id);
            if (string.IsNullOrWhiteSpace(categoria.Nome) || string.IsNullOrWhiteSpace(categoria.Descricao))
            {
                throw new Exception("O nome e a descrição da categoria não podem ser nulos ou vazios.");
            }
            categoriaAtt.Nome = categoria.Nome;
            categoriaAtt.Descricao = categoria.Descricao;

            await _geralRepo.Atualizar(categoriaAtt);
            return categoriaAtt;

        }

        public async Task<CategoriaServico> CriarCategoriaAsync(CategoriaServico categoria)
        {
            if (string.IsNullOrWhiteSpace(categoria.Nome) || string.IsNullOrWhiteSpace(categoria.Descricao))
            {
                throw new Exception("O nome e a descrição da categoria não podem ser nulos ou vazios.");
            }
            await _geralRepo.Adicionar(categoria);
            return categoria;

        }

        public async Task<CategoriaServico> DeletarCategoriaAsync(int id)
        {
            var categoria = await _geralRepo.PegarPorId<CategoriaServico>(id);
            if (categoria == null)
            {
                throw new Exception("Categoria não encontrada.");
            }
            await _geralRepo.Remover(categoria);
            return categoria;
        }

        public async Task<CategoriaServico> PegarCategoriaAsync(int id)
        {
            var categoria = await _geralRepo.PegarPorId<CategoriaServico>(id);
            if (categoria == null)
            {
                throw new Exception("Categoria não encontrada.");
            }
            return categoria;
        }

        public async Task<List<CategoriaServico>> PegarTodasCategoriasAsync()
        {
            var categorias = await _geralRepo.PegarTodos<CategoriaServico>();
            return categorias.ToList();
        }
    }
}
