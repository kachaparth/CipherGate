from scapy.all import sniff, DNS, DNSQR

def dns_callback(packet):
    if packet.haslayer(DNS) and packet.haslayer(DNSQR):    
        domain = packet[DNSQR].qname.decode() 
        print(f"🌍 Website Accessed: {domain}")

sniff(filter="udp port 53", prn=dns_callback, store=False)