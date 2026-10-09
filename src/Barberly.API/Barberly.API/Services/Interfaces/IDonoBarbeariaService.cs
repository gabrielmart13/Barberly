using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IDonoBarbeariaService
    {
        public Task<DonoBarbearia> CriarDonoBarbeariaAsync(DonoBarbearia donoBarbearia);
        public Task<DonoBarbearia?> PegarDonoBarbeariaAsync(int id);
        public Task<DonoBarbearia> DeletarDonoBarbeariaAsync(int id);
        public Task<DonoBarbearia> AtualizarDonoBarbeariaAsync(int id, DonoBarbearia donoBarbearia);
    }
}
