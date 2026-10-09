using Barberly.API.Data.Repositories;
using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class AgendamentoService : IAgendamentoService
    {
        private readonly IGeralRepo _geralRepo;
        public AgendamentoService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Agendamento> CriarAgendamentoAsync(Agendamento agendamento)
        {
            if(string.IsNullOrWhiteSpace(agendamento.Status) || agendamento.IdBarbearia == 0 || agendamento.IdUsuario == 0 || agendamento.DataHora == null || agendamento.IdServico == 0)
            {
                throw new ArgumentException(" Voce deve preencher todos os campos obrigatórios.");
            }
            await _geralRepo.Adicionar<Agendamento>(agendamento);
            return agendamento;
        }

        public async Task<Agendamento> DeletarAgendamentoAsync(int id)
        {
            var agendamento = await _geralRepo.PegarPorId<Agendamento>(id);
            if (agendamento == null)
            {
                throw new ArgumentException("Agendamento não encontrado.");
            }
            await _geralRepo.Remover<Agendamento>(agendamento);
            return agendamento;
        }

        public async Task<Agendamento?> PegarAgendamentoAsync(int id)
        {
            var agendamento = await _geralRepo.PegarPorId<Agendamento>(id);
            if(agendamento == null)
            {
                throw new ArgumentException("Agendamento não encontrado.");
            }
            return agendamento;
        }

        public async Task<List<Agendamento>> PegarAgendamentosAsync()
        {
            var agendamentos = await _geralRepo.PegarTodos<Agendamento>();
            return agendamentos.ToList();
        }
    }
}
