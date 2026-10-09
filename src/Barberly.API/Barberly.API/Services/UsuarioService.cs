using Barberly.API.Data.Repositories.Interfaces;
using Barberly.API.Domain.Models;
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

        public async Task<Usuario> AtualizarUsuarioAsync(int id, Usuario usuario)
        {
            if(usuario == null)
            {
                throw new Exception("O usuário não pode ser nulo.");
            }
            var usuarioAtt = await _geralRepo.PegarPorId<Usuario>(id);

            if (string.IsNullOrEmpty(usuario.Nome) || string.IsNullOrEmpty(usuario.Email) || string.IsNullOrEmpty(usuario.Senha))
            {
                throw new Exception("Nome, Email e Senha são obrigatórios.");
            }

            usuarioAtt.Nome = usuario.Nome;
            usuarioAtt.Email = usuario.Email;
            usuarioAtt.Senha = usuario.Senha;
            usuarioAtt.Contato = usuario.Contato;

            await _geralRepo.Atualizar<Usuario>(usuarioAtt);
            return usuarioAtt;
        }

        public async Task<Usuario> CriarUsuarioAsync(Usuario usuario)
        {
            if(string.IsNullOrEmpty(usuario.Nome) || string.IsNullOrEmpty(usuario.Email) || string.IsNullOrEmpty(usuario.Senha))
            {
                throw new Exception("Nome, Email e Senha são obrigatórios.");
            }
            await _geralRepo.Adicionar<Usuario>(usuario);
            return usuario;
        }

        public async Task<Usuario> DeletarUsuarioAsync(int id)
        {
            var usuario = await _geralRepo.PegarPorId<Usuario>(id);
            if(usuario == null)
            {
                throw new Exception("Usuário não encontrado.");
            }
            await _geralRepo.Remover<Usuario>(usuario);
            return usuario;
        }

        public async Task<List<Usuario>> PegarTodosUsuariosAsync()
        {
            var usuarios = await _geralRepo.PegarTodos<Usuario>();
            return usuarios.ToList();
        }

        public async Task<Usuario> PegarUsuarioAsync(int id)
        {
            var usuario = await _geralRepo.PegarPorId<Usuario>(id);
            if (usuario == null)
            {
                throw new Exception("Usuário não encontrado.");
            }
            return usuario;
        }
    }
}
