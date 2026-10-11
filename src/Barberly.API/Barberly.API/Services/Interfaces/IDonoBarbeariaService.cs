using Barberly.API.Domain.DTOs.DonoBarbeariaDTO;
using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IDonoBarbeariaService
    {
        public Task<DonoBarbearia> CriarDonoBarbeariaAsync(CriarDonoBarbeariaRequest request);
        public Task<DonoBarbearia?> PegarDonoBarbeariaAsync(int id);
        public Task<DonoBarbearia> DeletarDonoBarbeariaAsync(int id);
        public Task<DonoBarbearia> AtualizarDonoBarbeariaAsync(int id, AtualizarDonoBarbeariaRequest request);
    }
}
