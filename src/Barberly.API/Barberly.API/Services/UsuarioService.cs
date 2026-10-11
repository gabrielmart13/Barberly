using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.DTOs.UsuarioDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Exceptions;
using Barberly.API.Services.Interfaces;

namespace Barberly.API.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IGeralRepo _geralRepo;

        public UsuarioService(IGeralRepo geralRepo)
        {
            _geralRepo = geralRepo;
        }

        // Busca um usuário pelo ID e atualiza seus dados.
        public async Task<Usuario> AtualizarUsuarioAsync(int id,AtualizarUsuarioRequest request)
        {
            var usuario = await _geralRepo.PegarPorId<Usuario>(id);

            if (usuario == null)
            {
                throw new NotFoundException("Usuário não encontrado.");
            }

            if (request == null)
            {
                throw new ValidationException("Os dados de atualização são obrigatórios.");
            }

            usuario.Nome = request.Nome;
            usuario.Email = request.Email;
            usuario.Contato = request.Contato;

            await _geralRepo.Atualizar<Usuario>(usuario);

            return usuario;
        }

        // Exclui um usuário pelo ID.
        public async Task<Usuario> DeletarUsuarioAsync(int id)
        {
            var usuario = await _geralRepo.PegarPorId<Usuario>(id);

            if (usuario == null)
            {
                throw new NotFoundException("Usuário não encontrado.");
            }

            await _geralRepo.Remover<Usuario>(usuario);

            return usuario;
        }

        // Retorna todos os usuários.
        public async Task<List<Usuario>> PegarTodosUsuariosAsync()
        {
            var usuarios = await _geralRepo.PegarTodos<Usuario>();

            return usuarios.ToList();
        }

        // Busca um usuário pelo ID.
        public async Task<Usuario> PegarUsuarioAsync(int id)
        {
            var usuario = await _geralRepo.PegarPorId<Usuario>(id);

            if (usuario == null)
            {
                throw new NotFoundException("Usuário não encontrado.");
            }

            return usuario;
        }
    }
}
