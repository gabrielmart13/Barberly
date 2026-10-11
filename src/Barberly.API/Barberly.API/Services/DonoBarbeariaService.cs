using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.DTOs.DonoBarbeariaDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
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

        public async Task<DonoBarbearia> AtualizarDonoBarbeariaAsync(int id, AtualizarDonoBarbeariaRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Dono da barbearia não pode ser nulo.");
            }

            var donoBarbeariaAtt = await _geralRepo.PegarPorId<DonoBarbearia>(id);
            if (donoBarbeariaAtt == null)
            {
                throw new NotFoundException("Dono da barbearia não encontrado.");
            }

            if (string.IsNullOrWhiteSpace(request.Nome) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Senha) ||
                string.IsNullOrWhiteSpace(request.Contato))
            {
                throw new Barberly.API.Exceptions.ValidationException("Precisa informar todas as informações.");
            }

            donoBarbeariaAtt.Nome = request.Nome;
            donoBarbeariaAtt.Email = request.Email;
            donoBarbeariaAtt.Senha = request.Senha;
            donoBarbeariaAtt.Contato = request.Contato;

            await _geralRepo.Atualizar<DonoBarbearia>(donoBarbeariaAtt);
            return donoBarbeariaAtt;
        }

        public async Task<DonoBarbearia> CriarDonoBarbeariaAsync(CriarDonoBarbeariaRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Os dados do dono da barbearia não podem ser nulos.");
            }

            if (string.IsNullOrWhiteSpace(request.Nome) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Senha) ||
                string.IsNullOrWhiteSpace(request.Contato))
            {
                throw new Barberly.API.Exceptions.ValidationException("Precisa informar todas as informações.");
            }

            var donoBarbearia = new DonoBarbearia
            {
                Nome = request.Nome,
                Email = request.Email,
                Senha = request.Senha,
                Contato = request.Contato
            };

            await _geralRepo.Adicionar<DonoBarbearia>(donoBarbearia);
            return donoBarbearia;
        }

        public async Task<DonoBarbearia> DeletarDonoBarbeariaAsync(int id)
        {
            var donoBarbearia = await _geralRepo.PegarPorId<DonoBarbearia>(id);
            if (donoBarbearia == null)
            {
                throw new NotFoundException("Dono da barbearia não encontrado.");
            }
            await _geralRepo.Remover<DonoBarbearia>(donoBarbearia);
            return donoBarbearia;
        }

        public async Task<DonoBarbearia?> PegarDonoBarbeariaAsync(int id)
        {
            var donoBarbearia = await _geralRepo.PegarPorId<DonoBarbearia>(id);
            if (donoBarbearia == null)
            {
                throw new NotFoundException("Dono da barbearia não encontrado.");
            }
            return donoBarbearia;
        }
    }
}