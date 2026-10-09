using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
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
        public async Task<Barbeiro> CriarBarbeiroAsync(Barbeiro barbeiro)
        {
            if (string.IsNullOrWhiteSpace(barbeiro.Nome) || string.IsNullOrWhiteSpace(barbeiro.Email) || string.IsNullOrWhiteSpace(barbeiro.Contato) || barbeiro.IdBarbearia == null)
            {
                throw new Exception("Nome, Email, Contato e IdBarbearia são obrigatórios.");
            }
            await _geralRepo.Adicionar<Barbeiro>(barbeiro);
            return barbeiro;
        }
        public async Task<Barbeiro> PegarBarbeiroAsync(int id)
        {
            var barbeiro = await _geralRepo.PegarPorId<Barbeiro>(id);
            if (barbeiro == null)
            {
                throw new Exception($"Barbeiro não encontrado.");
            }
            return barbeiro;
        }
        public async Task<List<Barbeiro>> PegarTodosBarbeirosAsync()
        {
            var barbeiros = await _geralRepo.PegarTodos<Barbeiro>();
            return barbeiros.ToList();
        }
        public async Task<Barbeiro> AtualizarBarbeiroAsync(int id, Barbeiro barbeiro)
        {
            if(barbeiro == null)
            {
                throw new Exception("Barbeiro não pode ser nulo.");
            }
            var barbeiroAtt = await _geralRepo.PegarPorId<Barbeiro>(id);

            if (string.IsNullOrWhiteSpace(barbeiro.Nome) || string.IsNullOrWhiteSpace(barbeiro.Email) || string.IsNullOrWhiteSpace(barbeiro.Contato) || barbeiro.IdBarbearia == null)
            {
                throw new Exception("Nome, Email, Contato e IdBarbearia são obrigatórios.");
            }
            // Atualiza os campos do barbeiro existente com os valores do novo barbeiro
            barbeiroAtt.Nome = barbeiro.Nome;
            barbeiroAtt.Email = barbeiro.Email;
            barbeiroAtt.Contato = barbeiro.Contato;
            barbeiroAtt.IdBarbearia = barbeiro.IdBarbearia;
            await _geralRepo.Atualizar<Barbeiro>(barbeiroAtt);
            return barbeiroAtt;
        }
        public async Task<Barbeiro> DeletarBarbeiroAsync(int id)
        {
            var barbeiro = await _geralRepo.PegarPorId<Barbeiro>(id);
            if (barbeiro == null)
            {
                throw new Exception($"Barbeiro não encontrado.");
            }
            await _geralRepo.Remover<Barbeiro>(barbeiro);
            return barbeiro;
        }

    }
}
