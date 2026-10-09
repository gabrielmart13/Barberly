using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
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

        public async Task<Servico> AtualizarServicoAsync(int id, Servico servico)
        {
            if(servico == null)
            {
                throw new Exception("O serviço não pode ser nulo.");
            }
            var servicoAtt = await _geralRepo.PegarPorId<Servico>(id);
            if(servico.Valor == null || servico.IdCategoria == null || servico.IdBarbearia == null || string.IsNullOrWhiteSpace(servico.Nome))
            {
                throw new Exception("Voce precisa informar todos os campos obrigatórios.");
            }
            servicoAtt.Nome = servico.Nome;
            servicoAtt.Valor = servico.Valor;
            servicoAtt.TempoEstimado = servico.TempoEstimado;
            servicoAtt.IdCategoria = servico.IdCategoria;
            
            await _geralRepo.Atualizar(servicoAtt);
            return servicoAtt;
        }

        public async Task<Servico> CriarServicoAsync(Servico servico)
        {
            if (string.IsNullOrWhiteSpace(servico.Nome) || servico.Valor == null || servico.IdCategoria == null || servico.IdBarbearia == null)
            {
                throw new Exception("Voce precisa informar todos os campos obrigatórios.");
            }
            await _geralRepo.Adicionar(servico);
            return servico;
        }
        

        public async Task<Servico> DeletarServicoAsync(int id)
        {
            var servico = await _geralRepo.PegarPorId<Servico>(id);
            if (servico == null)
            {
                throw new Exception("Serviço não encontrado.");
            }
            await _geralRepo.Remover(servico);
            return servico;
        }

        public async Task<Servico> PegarServicoAsync(int id)
        {
            var servico = await _geralRepo.PegarPorId<Servico>(id);
            if (servico == null)
            {
                throw new Exception("Serviço não encontrado.");
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
