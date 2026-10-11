using Barberly.API.Domain.DTOs.AgendamentoDTO;
using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IAgendamentoService
    {
        public Task<Agendamento> CriarAgendamentoAsync(CriarAgendamentoRequest request);
        public Task<Agendamento?> PegarAgendamentoAsync(int id);
        public Task<List<Agendamento>> PegarAgendamentosAsync();
        public Task<Agendamento> DeletarAgendamentoAsync(int id);
    }
}
