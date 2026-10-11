using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.DTOs.CategoriaServicoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
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

        public async Task<CategoriaServico> AtualizarCategoriaAsync(int id, AtualizarCategoriaRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("A categoria não pode ser nula.");
            }

            var categoriaAtt = await _geralRepo.PegarPorId<CategoriaServico>(id);
            if (categoriaAtt == null)
            {
                throw new NotFoundException("Categoria não encontrada.");
            }

            if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Descricao))
            {
                throw new Barberly.API.Exceptions.ValidationException("O nome e a descrição da categoria não podem ser nulos ou vazios.");
            }

            categoriaAtt.Nome = request.Nome;
            categoriaAtt.Descricao = request.Descricao;

            await _geralRepo.Atualizar(categoriaAtt);
            return categoriaAtt;
        }

        public async Task<CategoriaServico> CriarCategoriaAsync(CriarCategoriaRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Os dados da categoria não podem ser nulos.");
            }

            if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Descricao))
            {
                throw new Barberly.API.Exceptions.ValidationException("O nome e a descrição da categoria não podem ser nulos ou vazios.");
            }

            var categoria = new CategoriaServico
            {
                Nome = request.Nome,
                Descricao = request.Descricao
            };

            await _geralRepo.Adicionar(categoria);
            return categoria;
        }

        public async Task<CategoriaServico> DeletarCategoriaAsync(int id)
        {
            var categoria = await _geralRepo.PegarPorId<CategoriaServico>(id);
            if (categoria == null)
            {
                throw new NotFoundException("Categoria não encontrada.");
            }
            await _geralRepo.Remover(categoria);
            return categoria;
        }

        public async Task<CategoriaServico> PegarCategoriaAsync(int id)
        {
            var categoria = await _geralRepo.PegarPorId<CategoriaServico>(id);
            if (categoria == null)
            {
                throw new NotFoundException("Categoria não encontrada.");
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