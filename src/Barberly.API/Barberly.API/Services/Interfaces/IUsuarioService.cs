using Barberly.API.Domain.DTOs.UsuarioDTO;
using Barberly.API.Domain.Models;

namespace Barberly.API.Services.Interfaces
{
    public interface IUsuarioService
    {
        public Task<List<Usuario>> PegarTodosUsuariosAsync();
        public Task<Usuario> PegarUsuarioAsync(int id);
        public Task<Usuario> DeletarUsuarioAsync(int id);
        public Task<Usuario> AtualizarUsuarioAsync(int id, AtualizarUsuarioRequest request);
    }
}
