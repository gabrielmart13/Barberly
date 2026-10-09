using Barberly.API.Data.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Data.Repositories
{
    public class GeralRepo : IGeralRepo
    {
        private readonly DataContext _context;
        public GeralRepo(DataContext context) // Fazendo injeção de dependência do DataContext no repositório
        {
            _context = context;
        }
        public async Task<T> Adicionar<T>(T entity) where T : class
        {
            _context.Set<T>().Add(entity);
            await _context.SaveChangesAsync();

            return entity;
        }   

        public async Task<T> Atualizar<T>(T entity) where T : class
        {
            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();

            return entity;
        }

        public async Task<T?> PegarPorId<T>(int id) where T : class
        {
            var entity = await _context.Set<T>().FindAsync(id);

            return entity;
        }

        public async Task<List<T>> PegarTodos<T>() where T : class
        {
            var entities = await _context.Set<T>().ToListAsync();

            return entities;
        }

        public async Task<T> Remover<T>(T entity) where T : class
        {
            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
            return entity;
        }
        public async Task<bool> SalvarMudancasAsync()
        {
            var resultado = await _context.SaveChangesAsync();

            return resultado > 0;
        }
    }
}
