using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.DTOs.BarbeariaDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class BarbeariaService : IBarbeariaService
    {
        private readonly IGeralRepo _geralRepo;
        public BarbeariaService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        public async Task<Barbearia> CriarBarbeariaAsync(CriarBarbeariaRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("A barbearia não pode ser nula.");
            }

            if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Endereco) || request.IdDonoBarbearia <= 0)
            {
                throw new Barberly.API.Exceptions.ValidationException("Nome, Endereço e IdDonoBarbearia são obrigatórios.");
            }

            var barbearia = new Barbearia
            {
                Nome = request.Nome,
                Endereco = request.Endereco,
                Contato = request.Contato,
                Descricao = request.Descricao,
                IdDonoBarbearia = request.IdDonoBarbearia
            };

            await _geralRepo.Adicionar<Barbearia>(barbearia);
            return barbearia;
        }

        public async Task<Barbearia?> PegarBarbeariaAsync(int id)
        {
            var barbearia = await _geralRepo.PegarPorId<Barbearia>(id);
            if (barbearia == null)
            {
                throw new NotFoundException("Barbearia não encontrada.");
            }
            return barbearia;
        }

        public async Task<List<Barbearia>> PegarBarbeariasAsync()
        {
            var barbearias = await _geralRepo.PegarTodos<Barbearia>();
            return barbearias.ToList();
        }

        public async Task<Barbearia> DeletarBarbeariaAsync(int id)
        {
            var barbearia = await _geralRepo.PegarPorId<Barbearia>(id);
            if (barbearia == null)
            {
                throw new NotFoundException("Barbearia não encontrada.");
            }
            await _geralRepo.Remover<Barbearia>(barbearia);
            return barbearia;
        }

        public async Task<Barbearia> AtualizarBarbeariaAsync(int id, AtualizarBarbeariaRequest request)
        {
            if (request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("A barbearia não pode ser nula.");
            }

            var barbeariaAtt = await _geralRepo.PegarPorId<Barbearia>(id);
            if (barbeariaAtt == null)
            {
                throw new NotFoundException("Barbearia não encontrada.");
            }

            if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Endereco) || request.IdDonoBarbearia <= 0)
            {
                throw new Barberly.API.Exceptions.ValidationException("Nome, Endereço e IdDonoBarbearia são obrigatórios.");
            }

            // Atualiza os campos da barbearia existente com os valores do DTO
            barbeariaAtt.Nome = request.Nome;
            barbeariaAtt.Endereco = request.Endereco;
            barbeariaAtt.Contato = request.Contato;
            barbeariaAtt.Descricao = request.Descricao;
            barbeariaAtt.IdDonoBarbearia = request.IdDonoBarbearia;

            await _geralRepo.Atualizar<Barbearia>(barbeariaAtt);
            return barbeariaAtt;
        }
    }
}