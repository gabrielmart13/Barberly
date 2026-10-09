using Barberly.API.Data;
using Barberly.API.Domain.DTOs.CategoriaServicoDTO;
using Barberly.API.Domain.Models;
using Barberly.API.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Asn1.Ocsp;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaServicoController : ControllerBase
    {
        private readonly ICategoriaServicoService _categoriaservicoService;
        public CategoriaServicoController(ICategoriaServicoService categoriaservicoService)
        {
            _categoriaservicoService = categoriaservicoService;
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoriaServico>>> Get()
        {
            var categoriaservicos = _categoriaservicoService.PegarTodasCategoriasAsync();
            return Ok(categoriaservicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaServico>> Get(int id)
        {
            var categoriaservico = await _categoriaservicoService.PegarCategoriaAsync(id);

            return Ok(categoriaservico);
        }

        [HttpPost]
        public async Task<ActionResult<CategoriaServico>> Post(CriarCategoriaRequest request)
        {
            CategoriaServico categoriaServico = new CategoriaServico
            {
                Nome = request.Nome,
                Descricao = request.Descricao
            };
            await _categoriaservicoService.CriarCategoriaAsync(categoriaServico);
            return Ok(categoriaServico);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoriaServico>> Put(int id, AtualizarCategoriaRequest request)
        {
            CategoriaServico categoriaServico = new CategoriaServico
            {
                Nome = request.Nome,
                Descricao = request.Descricao
            };
            await _categoriaservicoService.AtualizarCategoriaAsync(id,categoriaServico);
            return Ok(categoriaServico);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            return Ok(_categoriaservicoService.DeletarCategoriaAsync(id));
        }
    }
}
