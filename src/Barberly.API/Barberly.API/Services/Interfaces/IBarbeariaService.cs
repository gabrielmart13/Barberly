using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IBarbeariaService
    {
        public Task<Barbearia> CriarBarbeariaAsync(Barbearia barbearia);
        public Task<Barbearia?> PegarBarbeariaAsync(int id);
        public Task<List<Barbearia>> PegarBarbeariasAsync();
        public Task<Barbearia> DeletarBarbeariaAsync(int id);
        public Task<Barbearia> AtualizarBarbeariaAsync(int id, Barbearia barbearia);
    }
}
