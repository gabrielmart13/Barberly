using Barberly.API.Domain.DTOs.BarbeiroDTO;
using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IBarbeiroService
    {
        public Task<List<Barbeiro>> PegarTodosBarbeirosAsync();
        public Task<Barbeiro> PegarBarbeiroAsync(int id);
        public Task<Barbeiro> CriarBarbeiroAsync(CriarBarbeiroRequest request);
        public Task<Barbeiro> AtualizarBarbeiroAsync(int id, AtualizarBarbeiroRequest request);
        public Task<Barbeiro> DeletarBarbeiroAsync(int id);
    }
}
