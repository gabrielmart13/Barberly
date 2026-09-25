using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Barberly.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriaServicoController : ControllerBase
    {
        private readonly DataContext _context;
        public CategoriaServicoController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoriaServico>>> Get()
        {
            var categoriaservicos = await _context.CategoriaServicos.ToListAsync();
            return Ok(categoriaservicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoriaServico>> Get(int id)
        {
            var categoriaservicos = await _context.CategoriaServicos.FirstOrDefaultAsync(x => x.IdCategoria == id);
            if(categoriaservicos == null)
            {
                return NotFound();
            }

            return Ok(categoriaservicos);
        }

        [HttpPost]
        public async Task<ActionResult<CategoriaServico>> Post(CategoriaServico categoriaservico)
        {
            await _context.CategoriaServicos.AddAsync(categoriaservico);
            await _context.SaveChangesAsync();

            return Ok(categoriaservico);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoriaServico>> Put(int id, CategoriaServico categoriaservico)
        {
            var categoriaservicos = await _context.CategoriaServicos.FirstOrDefaultAsync(x => x.IdCategoria == id);
            if(categoriaservicos == null)
            {
                return NotFound();
            }

            categoriaservicos.Descricao = categoriaservico.Descricao;
            categoriaservicos.Nome = categoriaservico.Nome;

            await _context.SaveChangesAsync();
            return Ok(categoriaservicos);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var categoriaservicos = await _context.CategoriaServicos.FirstOrDefaultAsync(x => x.IdCategoria == id);
            if(categoriaservicos == null)
            {
                return NotFound();
            }
            _context.CategoriaServicos.Remove(categoriaservicos);
            await _context.SaveChangesAsync();

            return Ok(categoriaservicos);


        }
    }
}
