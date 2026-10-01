using Barberly.API.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IUsuarioService
    {
        public Task<List<Usuario>> PegarTodosUsuariosAsync();
        public Task<Usuario> PegarUsuarioAsync(int id);
        public Task<Usuario> CriarUsuarioAsync(Usuario usuario);
        public Task<Usuario> AtualizarUsuarioAsync(int id, Usuario usuario);
        public Task<Usuario> DeletarUsuarioAsync(int id);

    }
}
