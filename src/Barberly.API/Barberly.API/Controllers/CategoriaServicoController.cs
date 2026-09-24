using Barberly.API.Data;
using Barberly.API.Models;
using Microsoft.AspNetCore.Mvc;

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
        public ActionResult<List<CategoriaServico>> Get()
        {
            return new List<CategoriaServico>();
        }

        [HttpGet("{id}")]
        public ActionResult<CategoriaServico> Get(int id)
        {
            return new CategoriaServico();
        }

        [HttpPost]
        public ActionResult<CategoriaServico> Post(CategoriaServico categoriaservico)
        {
            return new CategoriaServico();
        }

        [HttpPut("{id}")]
        public ActionResult<CategoriaServico> Put(int id, CategoriaServico categoriaservico)
        {
            return new CategoriaServico();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            return NoContent();
        }
    }
}
