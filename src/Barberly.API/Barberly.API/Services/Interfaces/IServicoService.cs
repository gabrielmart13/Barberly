using Barberly.API.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IServicoService
    {
        public Task<List<Servico>> PegarTodosServicosAsync();
        public Task<Servico> PegarServicoAsync(int id);
        public Task<Servico> CriarServicoAsync(Servico servico);
        public Task<Servico> AtualizarServicoAsync(int id, Servico servico);
        public Task<Servico> DeletarServicoAsync(int id);
    }
}
