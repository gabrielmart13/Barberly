using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.DTOs.ServicoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class ServicoService : IServicoService
    {
        private readonly IGeralRepo _geralRepo;
        public ServicoService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Servico> AtualizarServicoAsync(int id, AtualizarServicoRequest request)
        {
            if(request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("O serviço não pode ser nulo.");
            }
            var servicoAtt = await _geralRepo.PegarPorId<Servico>(id);
            if(servicoAtt == null)
            {
                throw new NotFoundException("Servico não encontrado");
            }
            if(request.Valor < 0 || request.IdCategoria <= 0 || request.IdBarbearia <= 0 || string.IsNullOrWhiteSpace(request.Nome))
            {
                throw new Barberly.API.Exceptions.ValidationException("Voce precisa informar todos os campos obrigatórios.");
            }
            servicoAtt.Nome = request.Nome;
            servicoAtt.Valor = request.Valor;
            servicoAtt.TempoEstimado = request.TempoEstimado;
            servicoAtt.IdCategoria = request.IdCategoria;
            servicoAtt.IdBarbearia = request.IdBarbearia;
            
            await _geralRepo.Atualizar(servicoAtt);
            return servicoAtt;
        }

        public async Task<Servico> CriarServicoAsync(CriarServicoRequest request)
        {
            if(request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Os valores do servico estão nulo");
            }
            var servico = new Servico
            {
                Nome = request.Nome,
                Valor = request.Valor,
                IdBarbearia = request.IdBarbearia,
                IdCategoria = request.IdCategoria,
                TempoEstimado = request.TempoEstimado
            };
            if (string.IsNullOrWhiteSpace(servico.Nome) || servico.Valor < 0 || servico.IdCategoria <= 0 || servico.IdBarbearia <= 0)
            {
                throw new Barberly.API.Exceptions.ValidationException("Voce precisa informar todos os campos obrigatórios.");
            }
            await _geralRepo.Adicionar(servico);
            return servico;
        }
        

        public async Task<Servico> DeletarServicoAsync(int id)
        {
            var servico = await _geralRepo.PegarPorId<Servico>(id);
            if (servico == null)
            {
                throw new NotFoundException("Serviço não encontrado.");
            }
            await _geralRepo.Remover(servico);
            return servico;
        }

        public async Task<Servico> PegarServicoAsync(int id)
        {
            var servico = await _geralRepo.PegarPorId<Servico>(id);
            if (servico == null)
            {
                throw new NotFoundException("Serviço não encontrado.");
            }
            return servico;
        }
        

        public async Task<List<Servico>> PegarTodosServicosAsync()
        {
            var servicos = await _geralRepo.PegarTodos<Servico>();
            return servicos.ToList();
        }
    }
}
