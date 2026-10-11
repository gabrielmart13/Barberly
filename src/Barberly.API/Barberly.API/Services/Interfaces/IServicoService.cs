using Barberly.API.Domain.DTOs.ServicoDTO;
using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IServicoService
    {
        public Task<List<Servico>> PegarTodosServicosAsync();
        public Task<Servico> PegarServicoAsync(int id);
        public Task<Servico> CriarServicoAsync(CriarServicoRequest request);
        public Task<Servico> AtualizarServicoAsync(int id, AtualizarServicoRequest request);
        public Task<Servico> DeletarServicoAsync(int id);
    }
}
