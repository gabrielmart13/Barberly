namespace Barberly.API.Domain.DTOs.AvaliacaoDTO
{
    public class AtualizarAvaliacaoRequest
    {
        public int Nota { get; set; }
        public string Comentario { get; set; } = string.Empty;
    }
}
