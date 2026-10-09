using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IAgendamentoService
    {
        public Task<Agendamento> CriarAgendamentoAsync(Agendamento agendamento);
        public Task<Agendamento?> PegarAgendamentoAsync(int id);
        public Task<List<Agendamento>> PegarAgendamentosAsync();
        public Task<Agendamento> DeletarAgendamentoAsync(int id);
    }
}
