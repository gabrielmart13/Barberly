using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.DTOs.BarbeiroDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class BarbeiroService : IBarbeiroService
    {
        private readonly IGeralRepo _geralRepo;
        public BarbeiroService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }
        public async Task<Barbeiro> CriarBarbeiroAsync(CriarBarbeiroRequest request)
        {
            if(request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("O barbeiro e nulo");
            }
            if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Contato) || request.IdBarbearia <= 0)
            {
                throw new Barberly.API.Exceptions.ValidationException("Nome, Email, Contato e IdBarbearia são obrigatórios.");
            }
            var barbeiro = new Barbeiro
            {
                Nome = request.Nome,
                Email = request.Email,
                Contato = request.Contato,
                Experiencia = request.Experiencia,
                IdBarbearia = request.IdBarbearia
            };
            await _geralRepo.Adicionar<Barbeiro>(barbeiro);
            return barbeiro;
        }
        public async Task<Barbeiro> PegarBarbeiroAsync(int id)
        {
            var barbeiro = await _geralRepo.PegarPorId<Barbeiro>(id);
            if (barbeiro == null)
            {
                throw new NotFoundException($"Barbeiro não encontrado.");
            }
            return barbeiro;
        }
        public async Task<List<Barbeiro>> PegarTodosBarbeirosAsync()
        {
            var barbeiros = await _geralRepo.PegarTodos<Barbeiro>();
            return barbeiros.ToList();
        }
        public async Task<Barbeiro> AtualizarBarbeiroAsync(int id, AtualizarBarbeiroRequest request)
        {
            if(request == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Barbeiro não pode ser nulo.");
            }
            var barbeiroAtt = await _geralRepo.PegarPorId<Barbeiro>(id);
            if(barbeiroAtt == null)
            {
                throw new Barberly.API.Exceptions.ValidationException("Barbeiro não encontrado.");
            }
            if (string.IsNullOrWhiteSpace(request.Nome) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Contato) || request.IdBarbearia <= 0)
            {
                throw new Barberly.API.Exceptions.ValidationException("Nome, Email, Contato e IdBarbearia são obrigatórios.");
            }

            // Atualiza os campos do barbeiro existente com os valores do novo barbeiro
            barbeiroAtt.Nome = request.Nome;
            barbeiroAtt.Email = request.Email;
            barbeiroAtt.Contato = request.Contato;
            barbeiroAtt.IdBarbearia = request.IdBarbearia;

            await _geralRepo.Atualizar<Barbeiro>(barbeiroAtt);
            return barbeiroAtt;
        }
        public async Task<Barbeiro> DeletarBarbeiroAsync(int id)
        {
            var barbeiro = await _geralRepo.PegarPorId<Barbeiro>(id);
            if (barbeiro == null)
            {
                throw new NotFoundException($"Barbeiro não encontrado.");
            }
            await _geralRepo.Remover<Barbeiro>(barbeiro);
            return barbeiro;
        }

    }
}
