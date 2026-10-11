using Barberly.API.Domain.DTOs.BarbeariaDTO;
using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IBarbeariaService
    {
        public Task<Barbearia> CriarBarbeariaAsync(CriarBarbeariaRequest request);
        public Task<Barbearia?> PegarBarbeariaAsync(int id);
        public Task<List<Barbearia>> PegarBarbeariasAsync();
        public Task<Barbearia> DeletarBarbeariaAsync(int id);
        public Task<Barbearia> AtualizarBarbeariaAsync(int id, AtualizarBarbeariaRequest request);
    }
}
