using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class DonoBarbeariaService : IDonoBarbeariaService
    {
        private readonly IGeralRepo _geralRepo;
        public DonoBarbeariaService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<DonoBarbearia> AtualizarDonoBarbeariaAsync(int id, DonoBarbearia donoBarbearia)
        {
            if(donoBarbearia == null)
            {
                throw new Exception("Dono da barbearia não pode ser nulo.");
            }
            var donoBarbeariaAtt = await _geralRepo.PegarPorId<DonoBarbearia>(id);
            if (string.IsNullOrWhiteSpace(donoBarbearia.Nome) || string.IsNullOrWhiteSpace(donoBarbearia.Email) || string.IsNullOrWhiteSpace(donoBarbearia.Senha))
            {
                throw new Exception("Precisa informar todas as informações.");
            }

            donoBarbeariaAtt.Nome = donoBarbearia.Nome;
            donoBarbeariaAtt.Email = donoBarbearia.Email;
            donoBarbeariaAtt.Senha = donoBarbearia.Senha;
            donoBarbeariaAtt.Contato = donoBarbearia.Contato;

            await _geralRepo.Atualizar<DonoBarbearia>(donoBarbeariaAtt);
            return donoBarbeariaAtt;
        }

        public async Task<DonoBarbearia> CriarDonoBarbeariaAsync(DonoBarbearia donoBarbearia)
        {
            if (string.IsNullOrWhiteSpace(donoBarbearia.Nome) || string.IsNullOrWhiteSpace(donoBarbearia.Email) || string.IsNullOrWhiteSpace(donoBarbearia.Senha))
            {
                throw new Exception("Precisa informar todas as informações.");
            }
            await _geralRepo.Adicionar<DonoBarbearia>(donoBarbearia);
            return donoBarbearia;

        }

        public async Task<DonoBarbearia> DeletarDonoBarbeariaAsync(int id)
        {
            var donoBarbearia = await _geralRepo.PegarPorId<DonoBarbearia>(id);
            if (donoBarbearia == null)
            {
                throw new Exception("Dono da barbearia não encontrado.");
            }
            await _geralRepo.Remover<DonoBarbearia>(donoBarbearia);
            return donoBarbearia;
        }

        public async Task<DonoBarbearia?> PegarDonoBarbeariaAsync(int id)
        {
            var donoBarbearia = await _geralRepo.PegarPorId<DonoBarbearia>(id);
            if(donoBarbearia == null)
            {
                throw new Exception("Dono da barbearia não encontrado.");
            }
            return donoBarbearia;
        }
    }
}
