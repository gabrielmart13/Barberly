namespace Barberly.API.Data.Repositories.Interfaces
{
    public interface IGeralRepo
    {
        // Isso e um repositorio generico para o crud basico
        // O T e uma classe generica, que pode ser qualquer classe, e o where T : class garante que o T seja uma classe
        Task<T> Adicionar<T>(T entity) where T : class;
        Task<T> Atualizar<T>(T entity) where T : class;
        Task<T> Remover<T>(T entity) where T : class;
        Task<bool> SalvarMudancasAsync();
        Task<T?> PegarPorId<T>(int id) where T : class;
        Task<List<T>> PegarTodos<T>() where T : class;


    }
}
