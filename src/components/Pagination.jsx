import React from 'react'
import { MDBPagination, MDBPaginationItem, MDBPaginationLink } from 'mdb-react-ui-kit';

const Pagination = () => {
  return (
    <nav aria-label='Page navigation example'>
      <MDBPagination className='mb-0'>
        <MDBPaginationItem>
          <MDBPaginationLink href='#' style={{background:"#3B8BD0", color:"white"}}>Previous</MDBPaginationLink>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBPaginationLink href='#' style={{background:"white", color:"black", marginLeft:"5px"}}>1</MDBPaginationLink>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBPaginationLink href='#' style={{border:"1px solid black", color:"black", marginLeft:"5px"}}>2</MDBPaginationLink>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBPaginationLink href='#'  style={{border:"1px solid black", color:"black", marginLeft:"5px"}}>3</MDBPaginationLink>
        </MDBPaginationItem>
        <MDBPaginationItem>
          <MDBPaginationLink href='#' style={{background:"#3B8BD0", color:"white", marginLeft:"5px"}}>Next</MDBPaginationLink>
        </MDBPaginationItem>
      </MDBPagination>
    </nav>
  )
}

export default Pagination
