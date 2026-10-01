using Barberly.API.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IBarbeiroService
    {
        public Task<List<Barbeiro>> PegarTodosBarbeirosAsync();
        public Task<Barbeiro> PegarBarbeiroAsync(int id);
        public Task<Barbeiro> CriarBarbeiroAsync(Barbeiro barbeiro);
        public Task<Barbeiro> AtualizarBarbeiroAsync(int id, Barbeiro barbeiro);
        public Task<Barbeiro> DeletarBarbeiroAsync(int id);
    }
}
